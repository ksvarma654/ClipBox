from fastapi import FastAPI
from fastapi import FastAPI, Response
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


# Set up the password hashing context to verify passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app =  FastAPI()

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
    return {"message": "Login API is running"}

#request model
class User(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(user: User):
    # 1. Check if the user provided an email or a username
    if '@' in user.username:
        # Query the Global Secondary Index if it's an email
        response = table.query(
            IndexName="email-idx",
            KeyConditionExpression=Key("email").eq(user.username)
        )
        if not response.get('Items'):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        db_user = response['Items'][0]
    else:
        # Get by primary key if it's a username
        response = table.get_item(
            Key={
                'username': user.username
            }
        )
        if 'Item' not in response:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        db_user = response['Item']

    # 2. Verify the plain text password against the hashed password
    if not pwd_context.verify(user.password, db_user['password']):
        raise HTTPException(status_code=401, detail="password incorrect")


    
    return {"message": "Login successful!"}