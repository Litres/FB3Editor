/**
 * Схема XSD для элемента описания - biblio-description.
 *
 * @author dew1983@mail.ru	<Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.desc.Bibliodescription',
	{
		extend: 'FBEditor.xsd.desc.AbstractAnnotation',
		
		getJson: function ()
		{
			var me = this,
				json;
			
			json = me.callParent(['biblio-description']);
			
			return json;
		},

		getXsd: function ()
		{
			var me = this,
				xsd;

			xsd = me.callParent(['biblio-description']);

			return xsd;
		}
	}
);