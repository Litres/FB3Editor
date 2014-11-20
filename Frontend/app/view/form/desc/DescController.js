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
		onLoadData:  function (df)
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				converter,
				data;

			converter = FBEditor.converter.desc.Data;
			data = converter.toForm(df);
			//console.log(data);
			view.fireEvent('reset');
			form.setValues(data);
			Ext.getCmp('form-desc-sequence').fireEvent('loadData', data.sequence);
		},

		/**
		 * Сбрасывает поля формы.
		 */
		onReset:  function ()
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				fieldContainers;

			// сбрасываем все поля, которые имеют плагин fieldcontainerreplicator
			fieldContainers = view.query('[name=form-desc-plugin-fieldcontainerreplicator]');
			Ext.each(
				fieldContainers,
			    function (item)
			    {
				    item.fireEvent('resetFields');
			    }
			);

			// очищаем поля формы
			form.reset();
		}
	}
);