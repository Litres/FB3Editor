/**
 * Шаблон ресурсов для отображения в виде обычных значков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.tpl.NormalResource',
	{
		extend: 'Ext.XTemplate',

		constructor: function ()
		{
			var me = this;

			me.html = '<tpl for=".">' +
			          '<div class="resource-thumb-wrap resource-normal-thumb">' +
			          '<img src="{url}" class="resource-thumb-img" />' +
			          '<br/><span class="resource-thumb-name" title="{name}">{baseName}</span>' +
			          '</div>' +
			          '</tpl>';
		}
	}
);