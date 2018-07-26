Frontend
========
Portal frontend/templates documentation.

Frameworks
----------
The main HTML/CSS/JS framework used by the DataHub frontend is `Bootstrap 3 <http://getbootstrap.com/>`_. Note in particular that the Bootstrap grid system is used for layout.

Notifications
~~~~~~~~~~~~~
For notifications we use the standard `Django Messaging Framework <https://docs.djangoproject.com/en/1.8/ref/contrib/messages/>`_ where relevant. For js/AJAX actions we use the `noty.js <http://ned.im/noty/#/about>`_.

Templates
---------
All templates extend the `/templates/base.html` super template which contains the skeleton layout for all pages in the DataHub. Child pages will extend this page and may opt to override key `{% block %}` elements in this page. The core content should be placed in the `content` block. Other key blocks include `css`, `javascript` and `breadcrumbs`. Review the base and child templates to see how these work.

Breadcrumbs
~~~~~~~~~~~
Of special note is the breadcrumb system. A super-template pages defines its own breadcrumbs reaching that page and child templates will extend these breadcrumbs by calling `{{ block.super }}` then continuing the breadcrumb trail. For example::

    {# Super-templates: /templates/programme/base.html #}

    {% block breadcrumbs %}
        {% if request.user.is_staff %}
            {{ programme.company.name }} &raquo;
        {% endif %}
        <a href="{% url 'programme:index' %}">All programmes</a>
    {% endblock breadcrumbs %}

    -------------------------------------

    {# Child-template: /templates/programme/programme_detail.html #}

    {% block breadcrumbs %}
        {{ block.super }} &raquo; {{ programme.name }}
    {% endblock breadcrumbs %}

