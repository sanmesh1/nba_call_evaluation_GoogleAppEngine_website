#USER INPUT
forceRewriteData = 1
season = "2019-20"
urlOf2MinReportMainPage = "https://official.nba.com/" + season + "-nba-officiating-last-two-minute-reports/"


from selenium import webdriver
import time
import re
import csv
import pandas as pd
import pdb
import urllib, json



def getHtmlFrom2MinReport(urlOf2MinReportMainPage):
	browser = webdriver.Chrome() #replace with .Firefox(), or with the browser of your choice
	#browser = webdriver.Firefox()

	browser.get(urlOf2MinReportMainPage) #navigate to the page
	html_string = browser.execute_script("return document.body.innerHTML") #returns the inner HTML as a string
	time.sleep(2)
	browser.quit()
	return html_string
	# print(innerHTML)
	
def getDictOfGameIdsAndUrlsFrom2minReport(htmlOf2MinReport):
	gameIdKeyUrlValueDict = {}
	for match in re.finditer("https://official.nba.com/l2m/L2MReport.html", htmlOf2MinReport):
		indexOfFirstTypeOfData = match.start()
		#find first URL
		endOfIndex = match.end()
		while htmlOf2MinReport[endOfIndex] != "\"":
			endOfIndex = endOfIndex + 1
		gameUrl = htmlOf2MinReport[indexOfFirstTypeOfData:endOfIndex]
		# print("gameUrl = ", gameUrl)
		#get game id
		for match2 in re.finditer("gameId=", gameUrl):
			start_index = match2.end()
			end_index = start_index
			while end_index < len(gameUrl) and gameUrl[end_index].isnumeric():
				end_index = end_index + 1
			gameId = gameUrl[start_index:end_index]
			
		gameIdKeyUrlValueDict[gameId] = gameUrl
	# print(gameIdKeyUrlValueDict)
	return gameIdKeyUrlValueDict

def checkIfTeamOrPlayerInCpOrDp(txt):
	names = txt.split()
	if len(names) > 1:
		return ("Player", names)
	elif len(names) == 1:
		return ("Team", names)
	else:
		return ("error", names)
	
def getTeamOfPlayer(name, comment, json2MinReportObject):
	if comment.isspace() == True or comment == None:
		return "error"
	ans = checkIfTeamOrPlayerInCpOrDp(name)
	if ans[0] == "Team":
		return name
	elif ans[0] == "Player":
		lastName = ans[1][-1]

		try:
			temp_index = comment.index(lastName)+ len(lastName)
		except ValueError:
			return "error"
		
		try:
			while comment[temp_index] != '(':
				temp_index+= 1
		except IndexError:
			return "error"
			
		start_index = temp_index+ 1
		end_index = start_index+3
		abbrevTeam = comment[start_index:end_index]
		
		if abbrevTeam == json2MinReportObject["game"][0]["Home_team_abbr"]:
			return json2MinReportObject["game"][0]["Home_team"]
		elif abbrevTeam == json2MinReportObject["game"][0]["Away_team_abbr"]:
			return json2MinReportObject["game"][0]["Away_team"]
		else:
			return "error"
	else:
		return "error"
		
def collectDataFrom2MinReports(gameIdKeyUrlValueDict, season):
	dataColumns = ['UniqueIdPlay', 'GameId', 'GameDate', 'link_2minreport', 
'Home_team', 'Away_team', 'HomeTeamScore', 
'VisitorTeamScore', 'CallType', 'committing_player', 
'committing_team', 'disadvantaged_player', 'disadvantaged_team',
'review_decision', 'video_link', 'comment',
'season', 'Difficulty', 'PCTime']
	df = pd.DataFrame(columns = dataColumns) 
	iterator = 0
	for gameId in gameIdKeyUrlValueDict.keys():
		time.sleep(0.1)
		url2MinReport = gameIdKeyUrlValueDict[gameId]		
		
		#get Json for a game
		url2MinReportJson = "https://official.nba.com/l2m/json/" + gameId + ".json"
		response = urllib.urlopen(url2MinReportJson)
		data = json.loads(response.read())
		
		#standard game data
		GameId = gameId
		GameDate = data["game"][0]["GameDate"] #need to check if in correct format
		link_2minreport = url2MinReport
		Home_team = data["game"][0]["Home_team"]
		Away_team = data["game"][0]["Away_team"]
		HomeTeamScore = data["game"][0]["HomeTeamScore"]
		VisitorTeamScore = data["game"][0]["VisitorTeamScore"]
		
		#call level data
		for i in range(len(data["l2m"])):
			callData = data["l2m"][i]
			UniqueIdPlay = gameId+'_'+str(i)
			CallType = callData["CallType"]
			comment = callData["Comment"]
			committing_player = callData["CP"]
			disadvantaged_player = callData["DP"]
			committing_team = ""
			disadvantaged_team = ""
			try:
				committing_team = getTeamOfPlayer(committing_player, comment, data)
			except:
				committing_team = "error"
			try:
				disadvantaged_team = getTeamOfPlayer(disadvantaged_player, comment, data)
			except:
				disadvantaged_team = "error"
			if disadvantaged_team == "error" and committing_team != "error":
				if committing_team == data["game"][0]["Home_team"]:
					disadvantaged_team = data["game"][0]["Away_team"]
				elif committing_team == data["game"][0]["Away_team"]:
					disadvantaged_team = data["game"][0]["Home_team"]
				else:
					pdb.set_trace()
					return "error"
			elif disadvantaged_team != "error" and committing_team == "error":
				if disadvantaged_team == data["game"][0]["Home_team"]:
					committing_team = data["game"][0]["Away_team"]
				elif disadvantaged_team == data["game"][0]["Away_team"]:
					committing_team = data["game"][0]["Home_team"]
				else:
					pdb.set_trace()
					return "error"
			
			review_decision = callData["CallRatingName"]
			video_link = "http://official.nba.com/last-two-minute-report/?gameNo=" + GameId + "&eventNum=" + callData["VideolLink"]
			#season is a global variable we set
			Difficulty = callData["Difficulty"]
			PCTime = callData["PCTime"]
			
			new_row = {'UniqueIdPlay': UniqueIdPlay, 'GameId': GameId, 'GameDate': GameDate, 'link_2minreport': link_2minreport, 
'Home_team': Home_team, 'Away_team': Away_team, 'HomeTeamScore': HomeTeamScore, 
'VisitorTeamScore': VisitorTeamScore, 'CallType': CallType, 'committing_player': committing_player, 
'committing_team': committing_team, 'disadvantaged_player': disadvantaged_player, 'disadvantaged_team': disadvantaged_team,
'review_decision': review_decision, 'video_link': video_link, 'comment': comment,
'season': season, 'Difficulty': Difficulty, 'PCTime': PCTime}
			df = df.append(new_row, ignore_index = True)
			# pdb.set_trace()
		df.to_csv(season + ".csv")
		print(iterator, " done out of ", len(gameIdKeyUrlValueDict.keys()))
		iterator+= 1
	return df
		
#http://official.nba.com/last-two-minute-report/?gameNo=" + GameId + "&eventNum=" + v.VideolLink
#example: https://official.nba.com/last-two-minute-report/?gameNo=0041900405&eventNum=2569
		
	# if fileExists == 1:
        # with open('twoMinReportData.csv', 'r+',newline='') as csvFile:
            # readCSV = csv.reader(csvFile, delimiter=',')
            # #search through data, and set urlExists = 1 if url exists already
            # for row in readCSV:
                # if gameURL == row[0:1][0]:
                    # urlExists = 1;
        # #if url doesnt exist, set extract data value to 1
        # if urlExists == 1:
            # print('Dont extract data')
        # else:
            # extractData = 1
    # else:
        # extractData = 1
    # #close file
    # csvFile.close()
    # #if we should extract data, extract data
    # if extractData == 1:    
        # print('extract data')
        # #############get data from game report
        # browser = webdriver.Chrome()
        # browser.get(gameURL) #navigate to the page
        # time.sleep(1)
        # min2text = browser.execute_script("return document.body.innerHTML") #returns the inner HTML as a string
        # time.sleep(1)
        # #with open("Output.txt", "w") as text_file:
            # #print(min2text, file=text_file)
            
        # numCorrectNonCall = min2text.count('>CNC<')
        # totalnumCorrectNonCall = totalnumCorrectNonCall + numCorrectNonCall
        # print("number of correct non calls")
        # print(numCorrectNonCall)

        # numCorrectCall = min2text.count('>CC<')
        # totalnumCorrectCall = totalnumCorrectCall + numCorrectCall
        # print("number of correct calls")
        # print(numCorrectCall)

        # numIncorrectNonCall = min2text.count('>INC<')
        # totalnumIncorrectNonCall = totalnumIncorrectNonCall + numIncorrectNonCall
        # print("number of incorrect non calls")
        # print(numIncorrectNonCall)

        # numIncorrectCall = min2text.count('>IC<')
        # totalnumIncorrectCall = totalnumIncorrectCall + numIncorrectCall
        # print("number of incorrect calls")
        # print(numIncorrectCall)

        # percentWrongCalls = 100*(numIncorrectNonCall+numIncorrectCall)/(numCorrectNonCall+numCorrectCall+numIncorrectNonCall+numIncorrectCall)
        # print("percent wrong calls")
        # print(percentWrongCalls)
        # browser.quit()
        # time.sleep(3)

        # print("total number of correct non calls")
        # print(totalnumCorrectNonCall)

        # print("total number of correct calls")
        # print(totalnumCorrectCall)

        # print("total number of incorrect non calls")
        # print(totalnumIncorrectNonCall)

        # print("total number of incorrect calls")
        # print(totalnumIncorrectCall)

        # totalpercentWrongCalls = 100*(totalnumIncorrectNonCall+totalnumIncorrectCall)/(totalnumCorrectNonCall+totalnumCorrectCall+totalnumIncorrectNonCall+totalnumIncorrectCall)
        # print("total percent wrong calls")
        # print(totalpercentWrongCalls)

        # #copy variables to csv file
        # with open('twoMinReportData.csv', 'a',newline='') as csvFile:
            # writer = csv.writer(csvFile)
            # writer.writerow([gameURL, numCorrectNonCall , numCorrectCall, numIncorrectNonCall, numIncorrectCall, percentWrongCalls, totalnumCorrectNonCall , totalnumCorrectCall, totalnumIncorrectNonCall, totalnumIncorrectCall, totalpercentWrongCalls])           
        # browser.quit()
        # time.sleep(1)
    # urlExists = 0
    # extractData = 0 
        
    

if __name__ == "__main__":
	htmlOf2MinReport = getHtmlFrom2MinReport(urlOf2MinReportMainPage)
	gameIdKeyUrlValueDict = getDictOfGameIdsAndUrlsFrom2minReport(htmlOf2MinReport)
	
	# #debug
	# df = pd.DataFrame.from_dict(gameIdKeyUrlValueDict, orient='index')	
	# print(gameIdKeyUrlValueDict.keys())
	# df.to_csv('gameIds.csv')
	
	df = collectDataFrom2MinReports(gameIdKeyUrlValueDict, season)
	pdb.set_trace()
	print(df)
    
