# -*- coding: UTF-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
import re
import os
from multiprocessing.dummy import Pool as ThreadPool

"""

<div id="dvTable"><table border="1"><tbody><tr><th>Account</th><th>Transaction</th><th>Amount</th></tr><tr><td>Savings</td><td>Transaction 4952</td><td>69€</td></tr><tr><td>Savings</td><td>Transaction 4953</td><td>6€</td></tr><tr><td>Savings</td><td>Transaction 4954</td><td>67€</td></tr><tr><td>Savings</td><td>Transaction 4955</td><td>32€</td></tr><tr><td>Savings</td><td>Transaction 4956</td><td>37€</td></tr><tr><td>Savings</td><td>Transaction 4957</td><td>6€</td></tr><tr><td>Savings</td><td>Transaction 4958</td><td>79€</td></tr><tr><td>Savings</td><td>Transaction 4959</td><td>64€</td></tr><tr><td>Savings</td><td>Transaction 4960</td><td>45€</td></tr><tr><td>Savings</td><td>Transaction 4961</td><td>62€</td></tr><tr><td>Savings</td><td>Transaction 4962</td><td>27€</td></tr><tr><td>Savings</td><td>Transaction 4963</td><td>48€</td></tr><tr><td>Savings</td><td>Transaction 4964</td><td>61€</td></tr><tr><td>Savings</td><td>Transaction 4965</td><td>50€</td></tr><tr><td>Savings</td><td>Transaction 4966</td><td>59€</td></tr><tr><td>Savings</td><td>Transaction 4967</td><td>84€</td></tr><tr><td>Savings</td><td>Transaction 4968</td><td>109€</td></tr><tr><td>Savings</td><td>Transaction 4969</td><td>82€</td></tr><tr><td>Savings</td><td>Transaction 4970</td><td>19€</td></tr><tr><td>Savings</td><td>Transaction 4971</td><td>108€</td></tr><tr><td>Savings</td><td>Transaction 4972</td><td>97€</td></tr><tr><td>Savings</td><td>Transaction 4973</td><td>118€</td></tr><tr><td>Savings</td><td>Transaction 4974</td><td>111€</td></tr><tr><td>Savings</td><td>Transaction 4975</td><td>84€</td></tr><tr><td>Savings</td><td>Transaction 4976</td><td>89€</td></tr><tr><td>Savings</td><td>Transaction 4977</td><td>62€</td></tr><tr><td>Savings</td><td>Transaction 4978</td><td>31€</td></tr><tr><td>Savings</td><td>Transaction 4979</td><td>52€</td></tr><tr><td>Savings</td><td>Transaction 4980</td><td>49€</td></tr><tr><td>Savings</td><td>Transaction 4981</td><td>62€</td></tr><tr><td>Savings</td><td>Transaction 4982</td><td>103€</td></tr><tr><td>Savings</td><td>Transaction 4983</td><td>36€</td></tr><tr><td>Savings</td><td>Transaction 4984</td><td>105€</td></tr><tr><td>Savings</td><td>Transaction 4985</td><td>102€</td></tr><tr><td>Savings</td><td>Transaction 4986</td><td>111€</td></tr><tr><td>Savings</td><td>Transaction 4987</td><td>88€</td></tr><tr><td>Savings</td><td>Transaction 4988</td><td>121€</td></tr><tr><td>Savings</td><td>Transaction 4989</td><td>42€</td></tr><tr><td>Savings</td><td>Transaction 4990</td><td>91€</td></tr><tr><td>Savings</td><td>Transaction 4991</td><td>76€</td></tr><tr><td>Savings</td><td>Transaction 4992</td><td>129€</td></tr><tr><td>Savings</td><td>Transaction 4993</td><td>94€</td></tr><tr><td>Savings</td><td>Transaction 4994</td><td>111€</td></tr><tr><td>Savings</td><td>Transaction 4995</td><td>80€</td></tr><tr><td>Savings</td><td>Transaction 4996</td><td>137€</td></tr>

"""


def func(st):
	param = "?start="
	i = 0
	os.environ['MOZ_HEADLESS'] = '1'
	
	print "here 1"
	driver = webdriver.Firefox()
	
	
	inj_js = "<script>handler = {apply: function(target, thisArg, argList){argList[1] = 1;console.log(\"[TSL-Other] \"+ target + \": \" + argList.join(\",\"));return target.apply(thisArg, argList);}};setTimeout = new Proxy(setTimeout, handler);</script>"
	
	res = []
	
	while True:
		if i >= 1000:
			break
		print "Getting "+str(st+i)+"..."
		url = "http://127.0.0.1/"
		if i != 0:
			url += param+str(i)
		driver.get(url)
		try:
			source = driver.page_source
		except:
			alert = driver.switch_to.alert
			alert.accept()
			source = driver.page_source
		inner_html = inj_js + source 
#		driver.execute_script("document.innerHTML = `" + inner_html + "`");
#		driver.execute_script("$(document.body).trigger('load');");
		try:
			source = driver.page_source
		except:
			alert = driver.switch_to.alert
			alert.accept()
			source = driver.page_source
		print inner_html
		t = 0
		while t < 10  and "<table border=\"1\">" not in source:
			try:
				source = driver.page_source
				inner_html = inj_js + source 
#				driver.execute_script("document.innerHTML = `" + inner_html + "`");
#				driver.execute_script("$(document.body).trigger('load');");
			except:
				alert = driver.switch_to.alert
				alert.accept()
				source = driver.page_source
		print source
		pattern = ".tr..td.([a-zA-Z]*)..td..td.Transaction ([0-9]*)..td..td.([0-9]*)(.)..td...tr."
		exactMatch = re.compile(pattern, re.UNICODE)
		l = exactMatch.findall(source)
		if len(l) != 0:
			for e in l:
				d = dict()
				d["Account"] = e[0]
				d["Transaction"] = e[1]
				d["Amount"] = e[2]
				d["Currency"] = e[3]
				res.append(d)
		#print source
		i += 50
	
	driver.close()
	return res


"""
params = [0, 1000, 2000, 3000, 4000]

pool = ThreadPool(5)

results = pool.map(func, params)


pool.close()
pool.join()


print results
print len(results)
"""


func(0)
