/**
 * Контроллер текстового поля для фамилии/имени/отчества.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.NameController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.relations.subject.name',

		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				loading = FBEditor.desc.Manager.loadingProcess,
				title;

			// игнорируем при автоматическом заполнении полей описания (загрузка из книги или по ссылке)
			if (!loading)
			{
				// получаем данные из полей
				title = view.getTitle();
				title.autoValue();
			}
		},

		onFocus: function ()
		{
			//
		}
	}
);