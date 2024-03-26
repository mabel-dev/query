var Module=typeof globalThis.__pyodide_module!=="undefined"?globalThis.__pyodide_module:{};if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH="";if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof process==="undefined"&&typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}var PACKAGE_NAME="pyyaml.data";var REMOTE_PACKAGE_BASE="pyyaml.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"];var PACKAGE_UUID=metadata["package_uuid"];function fetchRemotePackage(packageName,packageSize,callback,errback){if(typeof process==="object"){require("fs").readFile(packageName,function(err,contents){if(err){errback(err)}else{callback(contents.buffer)}});return}var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}},handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","lib",true,true);Module["FS_createPath"]("/lib","python3.9",true,true);Module["FS_createPath"]("/lib/python3.9","site-packages",true,true);Module["FS_createPath"]("/lib/python3.9/site-packages","yaml",true,true);Module["FS_createPath"]("/lib/python3.9/site-packages","_yaml",true,true);Module["FS_createPath"]("/lib/python3.9/site-packages","PyYAML-5.4.1-py3.9.egg-info",true,true);function processPackageData(arrayBuffer){assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);var curr;var compressedData={data:null,cachedOffset:296759,cachedIndexes:[-1,-1],cachedChunks:[null,null],offsets:[0,1053,1746,2633,3513,4425,5280,6400,7281,8234,9254,10098,10845,11665,12542,13560,14527,15428,16082,16948,17728,18709,19363,20183,20808,21446,21967,23169,24265,25266,26151,26998,27655,28422,29227,30091,30978,31976,33046,33826,34665,35612,36540,37273,38121,39043,39764,40543,41581,42449,43197,44083,45042,46008,46954,47809,48726,49533,50422,51207,52033,52933,53822,54667,55759,56790,57692,58718,59602,60385,61270,62314,63047,64118,65021,66179,66988,67851,68678,69996,71242,72259,72941,74109,75295,76205,76889,77732,78768,79412,80384,81627,82421,83101,84063,85026,85981,86738,87638,88660,89564,90633,91671,92631,93603,94514,95506,96424,97779,98931,99858,100545,101344,102525,103547,104574,105702,106976,107768,108690,109483,110001,110541,111087,111610,112153,112664,113179,113711,114235,114760,115274,115789,116310,116834,117363,117894,118547,119679,120748,121705,122898,123974,125004,126145,127184,128291,129415,130390,131382,132492,133535,134535,135264,136026,136944,137954,138873,139898,140877,142008,142831,143414,143954,144890,145981,146949,147847,148672,149473,150262,151071,151924,152809,153876,154864,155946,157058,158024,159045,160177,160987,161677,162728,163694,164692,165709,166734,167820,168812,169972,171003,171968,172538,173341,174182,175093,175885,176896,177800,178802,180030,181407,182827,183924,185060,186140,187460,188705,189638,190305,191452,192675,194012,194982,195952,196646,197686,198302,199297,200582,201477,202366,203478,204502,205770,207103,208230,209378,210554,211596,212853,213729,215045,215879,216929,218051,218833,220011,220672,221411,222177,223340,224093,225409,226203,227042,228192,229184,229663,230323,230750,231695,232324,233077,233730,234438,235379,236560,237355,238558,239576,240700,241566,242277,243352,244450,245483,246567,247888,249309,250321,251483,252002,253014,254027,254634,255659,256696,257410,258252,259408,260296,261240,262105,262706,263612,264635,265429,266283,267080,267756,268732,269584,270370,270989,271856,272803,273836,274370,275237,276174,277142,278097,279368,280809,281911,282879,283899,284882,286049,287058,287986,288011,289068,290261,291173,291625,292252,292875,293530,294228,294658,295136,295586,296078],sizes:[1053,693,887,880,912,855,1120,881,953,1020,844,747,820,877,1018,967,901,654,866,780,981,654,820,625,638,521,1202,1096,1001,885,847,657,767,805,864,887,998,1070,780,839,947,928,733,848,922,721,779,1038,868,748,886,959,966,946,855,917,807,889,785,826,900,889,845,1092,1031,902,1026,884,783,885,1044,733,1071,903,1158,809,863,827,1318,1246,1017,682,1168,1186,910,684,843,1036,644,972,1243,794,680,962,963,955,757,900,1022,904,1069,1038,960,972,911,992,918,1355,1152,927,687,799,1181,1022,1027,1128,1274,792,922,793,518,540,546,523,543,511,515,532,524,525,514,515,521,524,529,531,653,1132,1069,957,1193,1076,1030,1141,1039,1107,1124,975,992,1110,1043,1e3,729,762,918,1010,919,1025,979,1131,823,583,540,936,1091,968,898,825,801,789,809,853,885,1067,988,1082,1112,966,1021,1132,810,690,1051,966,998,1017,1025,1086,992,1160,1031,965,570,803,841,911,792,1011,904,1002,1228,1377,1420,1097,1136,1080,1320,1245,933,667,1147,1223,1337,970,970,694,1040,616,995,1285,895,889,1112,1024,1268,1333,1127,1148,1176,1042,1257,876,1316,834,1050,1122,782,1178,661,739,766,1163,753,1316,794,839,1150,992,479,660,427,945,629,753,653,708,941,1181,795,1203,1018,1124,866,711,1075,1098,1033,1084,1321,1421,1012,1162,519,1012,1013,607,1025,1037,714,842,1156,888,944,865,601,906,1023,794,854,797,676,976,852,786,619,867,947,1033,534,867,937,968,955,1271,1441,1102,968,1020,983,1167,1009,928,25,1057,1193,912,452,627,623,655,698,430,478,450,492,681],successes:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]};compressedData["data"]=byteArray;assert(typeof Module.LZ4==="object","LZ4 not present - was your app build with  -s LZ4=1  ?");Module.LZ4.loadPackage({metadata:metadata,compressedData:compressedData},true);Module["removeRunDependency"]("datafile_pyyaml.data")}Module["addRunDependency"]("datafile_pyyaml.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({files:[{filename:"/lib/python3.9/site-packages/yaml/__init__.py",start:0,end:13170,audio:0},{filename:"/lib/python3.9/site-packages/yaml/composer.py",start:13170,end:18053,audio:0},{filename:"/lib/python3.9/site-packages/yaml/constructor.py",start:18053,end:46692,audio:0},{filename:"/lib/python3.9/site-packages/yaml/cyaml.py",start:46692,end:50543,audio:0},{filename:"/lib/python3.9/site-packages/yaml/dumper.py",start:50543,end:53380,audio:0},{filename:"/lib/python3.9/site-packages/yaml/emitter.py",start:53380,end:96386,audio:0},{filename:"/lib/python3.9/site-packages/yaml/error.py",start:96386,end:98919,audio:0},{filename:"/lib/python3.9/site-packages/yaml/events.py",start:98919,end:101364,audio:0},{filename:"/lib/python3.9/site-packages/yaml/loader.py",start:101364,end:103425,audio:0},{filename:"/lib/python3.9/site-packages/yaml/nodes.py",start:103425,end:104865,audio:0},{filename:"/lib/python3.9/site-packages/yaml/parser.py",start:104865,end:130360,audio:0},{filename:"/lib/python3.9/site-packages/yaml/reader.py",start:130360,end:137154,audio:0},{filename:"/lib/python3.9/site-packages/yaml/representer.py",start:137154,end:151338,audio:0},{filename:"/lib/python3.9/site-packages/yaml/resolver.py",start:151338,end:160337,audio:0},{filename:"/lib/python3.9/site-packages/yaml/scanner.py",start:160337,end:211614,audio:0},{filename:"/lib/python3.9/site-packages/yaml/serializer.py",start:211614,end:215779,audio:0},{filename:"/lib/python3.9/site-packages/yaml/tokens.py",start:215779,end:218352,audio:0},{filename:"/lib/python3.9/site-packages/yaml/_yaml.so",start:218352,end:641773,audio:0},{filename:"/lib/python3.9/site-packages/_yaml/__init__.py",start:641773,end:643175,audio:0},{filename:"/lib/python3.9/site-packages/PyYAML-5.4.1-py3.9.egg-info/PKG-INFO",start:643175,end:645284,audio:0},{filename:"/lib/python3.9/site-packages/PyYAML-5.4.1-py3.9.egg-info/dependency_links.txt",start:645284,end:645285,audio:0},{filename:"/lib/python3.9/site-packages/PyYAML-5.4.1-py3.9.egg-info/top_level.txt",start:645285,end:645296,audio:0},{filename:"/lib/python3.9/site-packages/PyYAML-5.4.1-py3.9.egg-info/SOURCES.txt",start:645296,end:667491,audio:0}],remote_package_size:300855,package_uuid:"a9a77468-0589-4a50-a065-f5f33693babe"})})();