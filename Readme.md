# 一个简单的vue库。
+ compile.js 负责编译tamplate
+ dependence.js 依赖收集，维护订阅的依赖，通知订阅者
+ observer.js 可观察的，负责把data里的数据加入数据拦截。
+ watcher.js 观察者