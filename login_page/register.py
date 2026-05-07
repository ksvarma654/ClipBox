from fastapi import FastAPI
import boto3
from fastapi import FastAPI, HTTPException
from boto3.dynamodb.conditions import Key
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from botocore.exceptions import ClientError

load_dotenv()

#dynamodb credentials
aws_access_key = os.getenv('aws_access_key_id')
aws_secret_key = os.getenv('aws_secret_access_key')
region = os.getenv('AWS_REGION') 
table_name = os.getenv('DYNAMODB_TABLE')

# Set up the password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#connect to dynamodb
dynamodb = boto3.resource('dynamodb', 
                          region_name= region, 
                          aws_access_key_id= aws_access_key, 
                          aws_secret_access_key= aws_secret_key)
table = dynamodb.Table(table_name)

@app.get("/")
def read_root():
    return {"message": "ClipBox API is running"}

#request model
class User(BaseModel):
    username: str
    email: str
    password: str
    mobile: str

#check username
def username_exists(username: str):
    response = table.get_item(
        Key={
            'username': username
        }
    )
    return 'Item' in response

# check email
def email_exists(email: str):
    res = table.query(
        IndexName="email-idx",
        KeyConditionExpression=Key("email").eq(email)
    )
    return len(res.get("Items", [])) > 0

#availabilit api
@app.get("/check_availability")
def check_availability(field: str, value: str):
    if field == 'username':
        exists = username_exists(value)
        return {"exists": exists,
                "message": "Username already exists" if exists else "Username is available"}
         
    if field == 'email':
        exists = email_exists(value)
        return {"exists": exists,
                "message": "Email already exists" if exists else "Email is available"}
    
    return {"message": "Invalid field"}




#register api
@app.post("/register", status_code=201)
def register_user(user: User):
    # Server-side validation to ensure data integrity
    # Note: Username check is now handled atomically by DynamoDB ConditionExpression
    if email_exists(user.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash the plaintext password securely
    hashed_password = pwd_context.hash(user.password)
    
    try:
        table.put_item(
            Item={
                'username': user.username,
                'email': user.email,
                'password': hashed_password,
                'mobile': user.mobile
            },
            ConditionExpression='attribute_not_exists(username)'
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            raise HTTPException(status_code=400, detail="Username already exists")
        print(f"DynamoDB ClientError: {e}")
        raise HTTPException(status_code=500, detail="Could not save user data.")
    except Exception as e:
        print(f"Error writing to DynamoDB: {e}")
        raise HTTPException(status_code=500, detail="Could not save user data.")

    return{"message": "Registration successful!"}