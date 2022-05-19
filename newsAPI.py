import requests
import json

url = ('https://newsapi.org/v2/top-headlines?country=us&apiKey=9262b874e52e419ab2355f131f296ba7')


try:
    response = requests.get(url)
except:
    print("Error")

news = json.loads(response.text)
#
# print(news);


for new in news["articles"]:
    print(str(new['title']))
    if str(new['description']) != "None":
        print(str(new['description']))
    print("\n")
    print(str(new['source']['name']))
    print(str(new['url']), "\n\n")
