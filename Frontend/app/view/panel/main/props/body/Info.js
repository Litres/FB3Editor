/**
 * Информация о выбранном элементе.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.Info',
	{
		extend: 'Ext.Component',
		xtype: 'props-element-info',
		id: 'props-element-info',

		initComponent: function ()
		{
			var me = this;

			me.tpl = new Ext.XTemplate(
				'<div class="element-info">',
				'<div class="element-info-name">{xmlName}</div>',
				'<div><span>Путь html:</span> {htmlPath}</div>',
				'</div>'
			);
			me.callParent(arguments);
		}
	}
);