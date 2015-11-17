/**
 * Контроллер ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.isbn.IsbnController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.documentInfo.isbn',

		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView(),
				isbn;

			isbn = view.down('form-desc-isbn');
			isbn.fireEvent('loadData', data);
		}
	}
);