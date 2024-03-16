import time
import requests
import json

'''
json_dump.json: json file of 30 scraped dictionaries from tripUpdates, scraped every 10 ish minutes between 10 am and 3:30 pm on Wednesday (03/06)
'''

eth_api = "https://passio3.com/harvard/passioTransit/gtfs/realtime/tripUpdates.json"
headers = {"Accept": "application/json"}

# initialize variable before the loop.
data2 = None
list_of_jsons = []
count = 0

while count < 30:
    r = requests.request("GET", eth_api, headers=headers)
    data2 = r.json()
    print(count)
    list_of_jsons.append(data2)

    # Wait 600 seconds (10 minutes) before continuing.
    time.sleep(600)

    count += 1

    # update json with new data2 after each time step
    with open('json_dump.json', 'w') as f:
        json.dump(list_of_jsons, f)