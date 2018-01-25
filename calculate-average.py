import subprocess

"""
	* Exacutes the program.
	* Takes it's execution time.
	* Return it.
"""
def gettime(a):
	try:
		a = subprocess.check_output(['casperjs','scrape.js'])
	except Exception, e:
		a = str(e.output)
	print a.split('\n')[0]
	return float(a.split('\n')[0])

"""
	* Calls gettime 50 times.
	* Prints the average of execution times
"""
def sequencial():
	sm = 0
	for i in xrange(50):
		sm += gettime(None)
	print "The average is : " + str(sm/50)

sequencial()
