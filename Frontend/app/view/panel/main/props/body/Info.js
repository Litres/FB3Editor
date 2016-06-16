/**
 * Информация о выбранном элементе.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.Info',
	{
		extend: 'Ext.Component',

		id: 'props-element-info',
		xtype: 'props-element-info',

		initComponent: function ()
		{
			var me = this;

			me.tpl = new Ext.XTemplate(
				'<div class="element-info">',
				'<div class="element-info-name">{elementName}</div>',
				'<div><tpl if="htmlPath"><span>Путь html:</span> {htmlPath}</tpl></div>',
				'</div>'
			);
			me.callParent(arguments);
		}
	}
);