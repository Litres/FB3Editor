/**
 * Контроллер формы описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.DescController',
	{
		extend: 'Ext.app.ViewController',
		requires: [
			'FBEditor.converter.desc.Data'
		],
		alias: 'controller.form.desc',

		/**
		 * Загружает данные в форму.
		 * @param {Object} df Данные, полученные из книги.
		 */
		onLoadDesc:  function (df)
		{
			var me = this,
				form = me.getView().getForm(),
				converter,
				data;

			converter = FBEditor.converter.desc.Data;
			data = converter.toForm(df);
			console.log(data);
			form.reset();
			form.setValues(data);
		}
	}
);