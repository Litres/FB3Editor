/**
 * Шаблон ресурсов для отображения в виде таблицы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.tpl.TableResource',
	{
		extend: 'Ext.XTemplate',

		constructor: function ()
		{
			var me = this;

			me.html = '<tpl for=".">' +
			          '<div class="resource-thumb-wrap resource-table-thumb">' +
			          '<span class="resource-thumb-img resource-thumb-img-{extension} fa fa-lg" /></span>' +
			          '<span class="resource-thumb-name" title="{name}">{baseName}</span>' +
			          '<span class="resource-thumb-date">{date}</span>' +
			          '<span class="resource-thumb-size">{size}</span>' +
			          '</div>' +
			          '</tpl>';
		}
	}
);