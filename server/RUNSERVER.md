# Execute app as a service

## This is to run the server after finish development. Before this, we need to run it as `grunt` to get live reload.

Install **pm2** as process manager and monitor.

```
$ sudo npm install pm2 -g
```

Run only app `main.js`

```
$ pm2 start main.js --name "m4e"
```

## Monitoring Process

```
$ pm2 show m4e
Describing process with id 0 - name m4e 
┌───────────────────┬───────────────────────────────────────────────┐
│ status            │ online                                        │
│ name              │ m4e                                           │
│ restarts          │ 0                                             │
│ uptime            │ 19s                                           │
│ script path       │ /home/hugomaldonado/Documentos/server/main.js │
│ script args       │ N/A                                           │
│ error log path    │ /home/hugomaldonado/.pm2/logs/m4e-error-0.log │
│ out log path      │ /home/hugomaldonado/.pm2/logs/m4e-out-0.log   │
│ pid path          │ /home/hugomaldonado/.pm2/pids/m4e-0.pid       │
│ interpreter       │ node                                          │
│ interpreter args  │ N/A                                           │
│ script id         │ 0                                             │
│ exec cwd          │ /home/hugomaldonado/Documentos/server         │
│ exec mode         │ fork_mode                                     │
│ node.js version   │ 4.2.6                                         │
│ watch & reload    │ ✘                                             │
│ unstable restarts │ 0                                             │
│ created at        │ 2016-10-23T13:11:50.686Z                      │
└───────────────────┴───────────────────────────────────────────────┘
 Code metrics value 
┌────────────┬────────┐
│ Loop delay │ 0.29ms │
└────────────┴────────┘
```

## Chech CPU and RAM management

```
$ pm2 monit
⌬ PM2 monitoring (To go further check out https://app.keymetrics.io)

 ● m4e                                 [                              ] 0 %
[0] [fork_mode]                        [||||                          ] 50.781 MB  
```


## Stop service

```
$ pm2 stop m4e
```

## References

- [PM2](https://www.npmjs.com/package/pm2)
