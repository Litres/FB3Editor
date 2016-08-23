/**
 * Контроллер смены заголовка
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.title.TitleController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.relations.subject.title',

		onChangeTitle: function(field, newVal) {
			var me = this,
				view = me.getView(),
				container,
				viewer;
			
			container = view.getCustomContainer();
			
			viewer = container.getCustomViewer();
			
			viewer.fireEvent('setTitle', newVal);
			
			// отключаем автоматическое заполнение
			view.autoFilled = false;
			
		}
	}
);