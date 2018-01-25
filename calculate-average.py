import subprocess
from multiprocessing.dummy import Pool as ThreadPool


def gettime(a):
	try:
		a = subprocess.check_output(['casperjs','scrape-one-load.js'])
	except Exception, e:
		a = str(e.output)
	print a.split('\n')[0]
	return float(a.split('\n')[0])


def threading():
	arr = [None]*100
	pool = ThreadPool(10)
	results = pool.map(gettime, arr)
	sm = 0

	for item in results:
		sm += item

	print sm/100


def sequencial():
	sm = 0
	for i in xrange(50):
		sm += gettime(None)
	print "The average is : " + str(sm/50)

sequencial()
