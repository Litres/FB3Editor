/**
 * Типы данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.ContentTypes',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		defaultContent: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
			'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
				'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />' +
				'<Default Extension="png" ContentType="image/png"/>' +
				'<Default Extension="jpg" ContentType="image/jpeg"/>' +
				'<Default Extension="gif" ContentType="image/gif"/>' +
				'<Default Extension="svg" ContentType="image/svg+xml"/>' +
				'<Default Extension="xml" ContentType="application/xml"/>' +
				'<Override PartName="/meta/core.xml" ' +
			                'ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
				'<Override PartName="/fb3/description.xml" ContentType="application/fb3-description+xml"/>' +
			    '<Override PartName="/fb3/body.xml" ContentType="application/fb3-body+xml"/>' +
		    '</Types>',

		getRels: function ()
		{
			return null;
		},

		/**
		 * Возвращает типы данных в виде json.
		 * @return {Object} Типы данных.
		 */
		getContent: function ()
		{
			var me = this;

			return me.getJson().Types;
		}
	}
);