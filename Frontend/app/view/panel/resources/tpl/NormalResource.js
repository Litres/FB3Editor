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
				'<tpl if="isFolder"><div class="resource-thumb-wrap resource-normal-thumb resource-folder-wrap">' +
				'<tpl else><div class="resource-thumb-wrap resource-normal-thumb"></tpl>' +
				'<tpl if="url"><img src="{url}" class="resource-thumb-img resource-thumb-img-{extension}" />' +
				'<tpl else><span class="resource-thumb-img-folder fa"></span></tpl>' +
				'<br/><span class="resource-thumb-name" title="{name}">{baseName}</span>' +
				'</div>' +
				'</tpl>';
		}
	}
);