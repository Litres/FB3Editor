/**
 * ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.isbn.Isbn',
	{
		extend: 'FBEditor.view.form.desc.isbn.Isbn',
		
		xtype: 'form-desc-publishInfo-isbn',

		fieldConfig: {
			plugins: 'fieldCleaner'
		}
	}
);