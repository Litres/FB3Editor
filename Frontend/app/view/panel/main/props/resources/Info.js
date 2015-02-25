/**
 * Информация о выбранном ресурсе.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.resources.Info',
	{
		extend: 'Ext.Component',
		xtype: 'props-resources-info',
		id: 'props-resources-info',

		initComponent: function ()
		{
			var me = this;

			me.tpl = new Ext.XTemplate(
				'<div class="resource-info">',
					'<div class="resource-info-name">{baseName}</div>',
					'<tpl if="isCover"><div class="resource-info-cover">Обложка книги</div></tpl>',
					'<tpl if="!isFolder"><div><span>Размеры:</span> {width} x {height}</div></tpl>',
					'<div><span>Дата:</span> {date}</div>',
					'<div><span>Тип:</span> {type}</div>',
					'<tpl if="isFolder"><div><span>Ресурсов:</span> {total}</div>',
					'<tpl else><div><span>Размер:</span> {size}</div></tpl>',
			    '</div>'
			);
			me.callParent(arguments);
		}
	}
);