---
layout: post
title:  "Picking the right tools"
date:   2016-03-09
---

<div class="person1" style="float:left; display:inline-block; ">
        <span style="float:left;width: 30%;margin-left: 13%">
            <img src="{{ '/assets/img/tools.png' | prepend: site.baseurl }}" alt="">
        </span>
        <span style="float:left;width: 55%;margin-left: 2%">
            <p style="float:left; display:block;"><span class="dropcap">T</span>here are tons of options when it comes to game development, different engines and frameworks to work with. We're going to take a look at some reviews of three of the tools suggested by Pablo (my professor): Phaser, Cocos2D-js and GDevelop.
            </p>
        </span>
 </div>

A little reddit search helped me find <a href="https://www.reddit.com/r/gamedev/comments/1tt3hz/what_html5_game_engine_you_recommend_me">this thread</a>, <b>Phaser</b> is one of the first frameworks recommended for HTML5 development. It is also the top rated and most popular of the three options at <a href="https://html5gameengine.com/">html5gameengine.com</a>.

Let's take a look at the pros and cons:

<center><img src="{{ '/assets/img/phaser.png' | prepend: site.baseurl }}" width="100" height="100"></center>

* <b>Pros</b>
	* Very well documented open source framework
	* Lots of examples and tutorials available
	* Active community
* <b>Cons</b>
	* Couldn't find any big ones

Moving on, let's take a look at <b>Cocos2D-js</b>. There seems to be less of a buzz about this one online, some people complain about support and bug-fixes for the js branch. Let's see some pros and cons:

<center><img src="{{ '/assets/img/cocos.png' | prepend: site.baseurl }}" width="75" height="100"></center>

* <b>Pros</b>
	* Open source
	* Cross platform
	* Used by many established mobile game developers
* <b>Cons</b>
	* Unorthodox API, <a href="http://www.developereconomics.com/top-game-development-tools-pros-cons/"> some reviews </a> point out the mix of Objective-C and C++ on the engine.
	* Not as straight-forward as raw JavaScript, because of Objective-C origins.

Basically Cocos2D-JS is similar to Phaser, another JavaScript-based engine but less intuitive. 

Last but not least, there's GDevelop. This engine is completely different from the other two, it comes with a simple interface and has visual scripting, which makes the creation of prototypes a lot easier. Let's see some pros and cons:

<center><img src="{{ '/assets/img/gdev.png' | prepend: site.baseurl }}" width="160" height="45"></center>

* <b>Pros</b>
	* Visual scripting tends to be easier and quicker
	* Free and open source
* <b>Cons</b>
	* Not ideal for big projects.

### Conclusion

So here's what I'll do, I'm going to give <b>Phaser</b> a try, I'm not a huge fan of JavaScript and I'm far from good at it, but the engine seems to have great potential so I'll see if I can do some decent prototypes.

If I fail miserably, I'll go with <b>GDevelop</b> because of how easy visual scripting is.