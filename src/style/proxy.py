import re
import requests
import threading

urls = '''
https://proxoid.net/api/getProxy?key=c012ed1f5812348b4ce483d5bb58a755&countries=all&types=http&level=all&speed=0&count=0

'''


file = open('proxy_new.txt', 'w')
#file.write('Proxies:\n')
file.close()
file = open('proxy_new.txt', 'a')
good_proxies = list()


def pattern_one(url):
    ip_port = re.findall('(\d{,3}\.\d{,3}\.\d{,3}\.\d{,3}:\d{2,5})', url)
    if not ip_port: pattern_two(url)
    else:
        for i in ip_port:
            i1 = 'http://'+i
            
            file.write(str(i1) + '\n')
            good_proxies.append(i)


def pattern_two(url):
    ip = re.findall('>(\d{,3}\.\d{,3}\.\d{,3}\.\d{,3})<', url)
    port = re.findall('td>(\d{2,5})<', url)
    if not ip or not port: pattern_three(url)
    else:
        for i in range(len(ip)):
            i1 = 'HTTP://'+i
            file.write(str(ip[i1]) + ':' + str(port[i1]) + '\n')
            good_proxies.append(str(ip[i1]) + ':' + str(port[i1]))


def pattern_three(url):
    ip = re.findall('>\n[\s]+(\d{,3}\.\d{,3}\.\d{,3}\.\d{,3})', url)
    port = re.findall('>\n[\s]+(\d{2,5})\n', url)
    if not ip or not port: pattern_four(url)
    else:
        for i in range(len(ip)):
            i1 = 'HTTP://'+i
            file.write(str(ip[i1]) + ':' + str(port[i1]) + '\n')
            good_proxies.append(str(ip[i1]) + ':' + str(port[i1]))


def pattern_four(url):
    ip = re.findall('>(\d{,3}\.\d{,3}\.\d{,3}\.\d{,3})<', url)
    port = re.findall('>(\d{2,5})<', url)
    if not ip or not port: pattern_five(url)
    else:
        for i in range(len(ip)):
            i1 = 'HTTP://'+i
            file.write(str(ip[i1]) + ':' + str(port[i1]) + '\n')
            good_proxies.append(str(ip[i1]) + ':' + str(port[i1]))


def pattern_five(url):
    ip = re.findall('(\d{,3}\.\d{,3}\.\d{,3}\.\d{,3})', url)
    port = re.findall('(\d{2,5})', url)
    for i in range(len(ip)):
        i1 = 'HTTP://'+i
        file.write(str(ip[i1]) + ':' + str(port[i1]) + '\n')
        good_proxies.append(str(ip[i1]) + ':' + str(port[i1]))


def start(url):
    try:
        req = requests.get(url, headers={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'}).text
        pattern_one(req)
        print(f' [+] Scrapping from: {url}')
    except requests.exceptions.SSLError: print(str(url) + ' Error')
    except: print(str(url) + ' Error')


threads = list()
for url in urls.splitlines():
    if url:
        x = threading.Thread(target=start, args=(url, ))
        x.start()
        threads.append(x)


for th in threads:
    th.join()


#input('Всё')
