/**
 * ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.isbn.Isbn',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.documentInfo.isbn.IsbnController'
		],

		id: 'form-desc-documentInfo-isbn',
		xtype: 'form-desc-documentInfo-isbn',
		controller: 'form.desc.documentInfo.isbn',
		flex: 1,
		layout: 'anchor',
		defaults: {
			anchor: '100%'
		},

		items: [
			{
				xtype: 'form-desc-isbn',
				fieldName: 'document-info-isbn'
			}
		]
	}
);