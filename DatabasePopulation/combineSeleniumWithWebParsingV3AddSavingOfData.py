#user input
forceRewriteData = 1

from selenium import webdriver
import time
import re
import csv

#initialize variables
extractData = 0
fileExists = 0
urlExists = 0

#check if datafile exists
try:
    fh = open("twoMinReportData.csv", 'r',newline='')
    fh.close()
    fileExists=  1;
    print("file ALREADY exist")
    # Store configuration file values
except FileNotFoundError:
    fileExists = 0;
    print("file DOESNT exist")
#if file doesnt exists, config to open in write mode and write header line
print (fileExists, forceRewriteData)
if fileExists == 0 or forceRewriteData == 1:
    print("rewriting file")
    with open('twoMinReportData.csv', 'w',newline='') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow(["Url", "CNC", "CC", "INC", "IC", "% of incorrect calls", "Total CNC", "Total CC", "Total INC", "Total IC", "Total % of incorrect calls"])
        print("created file")
    csvFile.close()

#############open twominutereport page
browser = webdriver.Chrome() #replace with .Firefox(), or with the browser of your choice
#browser = webdriver.Firefox()
urlMain = "https://official.nba.com/2018-19-nba-officiating-last-two-minute-reports/"
browser.get(urlMain) #navigate to the page
text = browser.execute_script("return document.body.innerHTML") #returns the inner HTML as a string
#print(innerHTML)
time.sleep(2)
browser.quit()

totalnumCorrectNonCall = 0
totalnumCorrectCall = 0
totalnumIncorrectNonCall = 0
totalnumIncorrectCall = 0

for match in re.finditer("https://official.nba.com/l2m/L2MReport.html", text):
    indexOfFirstTypeOfData = match.start()
    #find first URL
    endOfIndex = indexOfFirstTypeOfData
    ch = text[endOfIndex]
    while ch != "\"":
        endOfIndex = endOfIndex + 1
        ch = text[endOfIndex]
    gameURL = text[indexOfFirstTypeOfData:endOfIndex]
    print("game URL Found")
    print(gameURL)

    #if file exists already, check if webpage url is already in csv file
    if fileExists == 1:
        with open('twoMinReportData.csv', 'r+',newline='') as csvFile:
            readCSV = csv.reader(csvFile, delimiter=',')
            #search through data, and set urlExists = 1 if url exists already
            for row in readCSV:
                if gameURL == row[0:1][0]:
                    urlExists = 1;
        #if url doesnt exist, set extract data value to 1
        if urlExists == 1:
            print('Dont extract data')
        else:
            extractData = 1
    else:
        extractData = 1
    #close file
    csvFile.close()
    #if we should extract data, extract data
    if extractData == 1:    
        print('extract data')
        #############get data from game report
        browser = webdriver.Chrome()
        browser.get(gameURL) #navigate to the page
        time.sleep(1)
        min2text = browser.execute_script("return document.body.innerHTML") #returns the inner HTML as a string
        time.sleep(1)
        #with open("Output.txt", "w") as text_file:
            #print(min2text, file=text_file)
            
        numCorrectNonCall = min2text.count('>CNC<')
        totalnumCorrectNonCall = totalnumCorrectNonCall + numCorrectNonCall
        print("number of correct non calls")
        print(numCorrectNonCall)

        numCorrectCall = min2text.count('>CC<')
        totalnumCorrectCall = totalnumCorrectCall + numCorrectCall
        print("number of correct calls")
        print(numCorrectCall)

        numIncorrectNonCall = min2text.count('>INC<')
        totalnumIncorrectNonCall = totalnumIncorrectNonCall + numIncorrectNonCall
        print("number of incorrect non calls")
        print(numIncorrectNonCall)

        numIncorrectCall = min2text.count('>IC<')
        totalnumIncorrectCall = totalnumIncorrectCall + numIncorrectCall
        print("number of incorrect calls")
        print(numIncorrectCall)

        percentWrongCalls = 100*(numIncorrectNonCall+numIncorrectCall)/(numCorrectNonCall+numCorrectCall+numIncorrectNonCall+numIncorrectCall)
        print("percent wrong calls")
        print(percentWrongCalls)
        browser.quit()
        time.sleep(3)

        print("total number of correct non calls")
        print(totalnumCorrectNonCall)

        print("total number of correct calls")
        print(totalnumCorrectCall)

        print("total number of incorrect non calls")
        print(totalnumIncorrectNonCall)

        print("total number of incorrect calls")
        print(totalnumIncorrectCall)

        totalpercentWrongCalls = 100*(totalnumIncorrectNonCall+totalnumIncorrectCall)/(totalnumCorrectNonCall+totalnumCorrectCall+totalnumIncorrectNonCall+totalnumIncorrectCall)
        print("total percent wrong calls")
        print(totalpercentWrongCalls)

        #copy variables to csv file
        with open('twoMinReportData.csv', 'a',newline='') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow([gameURL, numCorrectNonCall , numCorrectCall, numIncorrectNonCall, numIncorrectCall, percentWrongCalls, totalnumCorrectNonCall , totalnumCorrectCall, totalnumIncorrectNonCall, totalnumIncorrectCall, totalpercentWrongCalls])           
        browser.quit()
        time.sleep(1)
    urlExists = 0
    extractData = 0 
        
    


    
