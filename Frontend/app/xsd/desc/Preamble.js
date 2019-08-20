/**
 * Схема XSD для элемента описания - preamble.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.Preamble',
	{
		extend: 'FBEditor.xsd.desc.AbstractAnnotation',
		
		getJson: function ()
		{
			var me = this,
				json;
			
			json = me.callParent(['preamble']);
			
			return json;
		},

		getXsd: function ()
		{
			var me = this,
				xsd;

			xsd = me.callParent(['preamble']);

			return xsd;
		}
	}
);