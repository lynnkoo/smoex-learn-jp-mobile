#!/bin/bash
# 获取传入的第一个参数，即文件位置
from_path="/Volumes/work/work/react-native-building-block/packages"
pattern='bbk-[a-z-]*$'

demoFun(){
  if [ ! -d $2  ];
  then
    mkdir $1
    mkdir $2
  else
    echo $2 exist
  fi

  # 遍历文件夹内所有的文件及文件夹，注意此处不是单引号，是反引号（因为这是一条命令）
  for doc in `find "${from_path}" -type d -maxdepth 2`
  do
    if [[ $doc =~  $pattern  ]]
    then
      `ln -s "${doc}" "$2"`
      # printf "link ${doc}\n"
    fi
  done
}

node_modules_path="/Volumes/work/work/rn_car_app/build/node_modules"
to_path="/Volumes/work/work/rn_car_app/build/node_modules/@ctrip"
demoFun ${node_modules_path} ${to_path}

node_modules_path="/Volumes/work/work/rn_car_app/src/node_modules"
to_path="/Volumes/work/work/rn_car_app/src/node_modules/@ctrip"
demoFun ${node_modules_path} ${to_path}
