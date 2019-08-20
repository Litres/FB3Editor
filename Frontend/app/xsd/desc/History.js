/**
 * Схема XSD для элемента описания - history.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.History',
	{
		extend: 'FBEditor.xsd.desc.AbstractAnnotation',
		
		getJson: function ()
		{
			var me = this,
				json;
			
			json = me.callParent(['history']);
			
			return json;
		},

		getXsd: function ()
		{
			var me = this,
				xsd;

			xsd = me.callParent(['history']);

			return xsd;
		}
	}
);