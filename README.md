nemesis_server
==============

Branching
--------------------------------------------------------------------------------------
*Master: Current Production / Staging code
*Development: Latest Untested Code.

Diary
--------------------------------------------------------------------------------------

*DEVELOPMENT @ 1456 17 OCTOBER 2013:
	*Work is continuing in the development branch as the underlying framework is 
	 now being re-designed for a more object-oriented approach.  This approach will
	 make the application more self-consistent and extensible over time.
	 
	*A global application configuration file has been added (app.conf.json) and the 
	 components of the application have become run-time packages identified in this file.

*MASTER @ 1121 12 OCTOBER 2013:
	*Work is in the Development branch but this branch will
	 only deploy servers and setup a foundation for the 
	 application.

  	*This is part of my DevOps-first philosophy, where the 
  	 beginning of any project should be establishing a very
  	 solid and reproducible platform before developing the 
  	 application.  By doing this, the project is guaranteed
  	 to maintain synchronization between dev, qa, stage and
  	 prod environments over time--reducing the amount of 
  	 problems during the project lifetime.

*DEVELOPMENT @ 0110 13 OCTOBER 2013:
	*MsgValidator.js has been fixed.
	*app.js is now sending {code:2}...this was breaking the server startup.
	*We are back in action.  The servers are spawning without error.
	*Started the routing code for broker (as a template for the other servers).

*MASTER @ 2200 12 OCTOBER 2013:
	*Application spawns worker threads
	*Configuration subsystem is working
	*Deployment process is tested (but still requires a base operating system).
	*A basic broker exists but it is broken (probably missing a send({code:0})
	
*DEVELOPMENT @ 2200 12 OCTOBER 2013:
	*Created from Master.



=======
Nemesis servers (audit, broker, cipher, keys)

*Status (master branch) 14 October 2013: Not operational.  
  Work is in the Development branch but this branch will
  only deploy servers and setup a foundation for the 
  application.

  This is part of my DevOps-first philosophy, where the 
  beginning of any project should be establishing a very
  solid and reproducible platform before developing the 
  application.  By doing this, the project is guaranteed
  to maintain synchronization between dev, qa, stage and
  prod environments over time--reducing the amount of 
  problems during the project lifetime.
