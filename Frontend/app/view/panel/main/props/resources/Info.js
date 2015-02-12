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

			me.tpl = new Ext.Template(
				'<div class="resource-info">',
					'<div class="resource-info-name">{baseName}</div>',
					'<div><span>Размеры:</span> {width} x {height}</div>',
					'<div><span>Дата:</span> {date}</div>',
					'<div><span>Тип:</span> {type}</div>',
					'<div><span>Размер:</span> {size}</div>',
			    '</div>'
			);
			me.callParent(arguments);
		}
	}
);