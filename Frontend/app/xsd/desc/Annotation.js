/**
 * Схема XSD для элемента описания - annotation.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.Annotation',
	{
		extend: 'FBEditor.xsd.desc.AbstractAnnotation',
		
		getJson: function ()
		{
			var me = this,
				json;
			
			json = me.callParent(['annotation']);
			
			return json;
		},

		getXsd: function ()
		{
			var me = this,
				xsd;

			xsd = me.callParent(['annotation']);

			return xsd;
		}
	}
);