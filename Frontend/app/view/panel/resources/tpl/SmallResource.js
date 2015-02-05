/**
 * Шаблон ресурсов для отображения в виде мелких значков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.tpl.SmallResource',
	{
		extend: 'Ext.XTemplate',

		constructor: function ()
		{
			var me = this;

			me.html = '<tpl for=".">' +
			          '<div class="resource-thumb-wrap resource-small-thumb">' +
			          '<span class="resource-thumb-img resource-thumb-img-{extension} fa fa-lg" /></span>' +
			          '<span class="resource-thumb-name" title="{name}">{baseName}</span>' +
			          '</div>' +
			          '</tpl>';
		}
	}
);