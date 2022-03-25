import json
import boto3
import logging
from boto3.dynamodb.conditions import Key
import requests

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # TODO implement
    #event is {"q":"show me dogs and cats"}
    # s3: photo-album-b2
    #output should be the photo id in the photo-album-b2
    
    
    
    client = boto3.client('lexv2-runtime')
    
    '''
    opensearch = boto3.client('opensearch',region_name='us-east-1')
    '''
    
    master = "COMSE6998"
    password = "Comse6998!"
    host_url = "https://search-photo-search-cxrf6gegik5b3jqre7fgna4gga.us-east-1.es.amazonaws.com/photo-search/_search"
    
    #botId, botAliasId, localeId, sessionId, text, sessionState, requestAttributes
    
    BOTID = "YAWFAYPXFD"
    BOTALIASID = "TSTALIASID"
    SESSIONID = 'user'
    LOCALEID= 'en_US'
    INPUTTEXT1 = 'Show me photos'
    
    INPUTTEXT2 = event['q']
    
    response = client.recognize_text(
        botId=BOTID,
        botAliasId=BOTALIASID,
        localeId=LOCALEID,
        sessionId=SESSIONID,
        text=INPUTTEXT1,
        #sessionState='',
        #requestAttributes=''
        )
    
    response2 = client.recognize_text(
        botId=BOTID,
        botAliasId=BOTALIASID,
        localeId=LOCALEID,
        sessionId=SESSIONID,
        text=INPUTTEXT2,
        #sessionState='',
        #requestAttributes=''
        )
    
    
    responseValues = response2['sessionState']["intent"]["slots"]["PhotoTypes"]["values"]
    
    idList = []
    
    for x in responseValues:
        value = x["value"]["interpretedValue"]
        query = {
                'size': 10,
                'query': {
                    'multi_match': {
                    'query': value,
                    'fields': ['labels']
                    }
                      
                }
                    
            }
        
        response3 = requests.get(host_url, auth=(master,password),json=query)
        data = response3.json()
        dataList = data['hits']['hits']
        
        for y in dataList:
            idList.append(y['_id'])
    
    idList = list(dict.fromkeys(idList))
    print(idList)
    
    
    return {
        'statusCode': 200,
        #'body': ["https://photo-album-b2.s3.amazonaws.com/1.jpg","https://photo-album-b2.s3.amazonaws.com/24_3_2022_21_29_23.jpg"]
        'body': idList
    }
