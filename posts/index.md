---
layout: base.njk
title: Posts
---

# All Posts

<ul>
{% for post in collections.posts %}
  <a href="{{ post.url | url }}">{{ post.data.title }}</a>
{% endfor %}
</ul>
