/**
 * Конртоллер переключателя.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.viewer.switcher.SwitcherController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.form.desc.relations.subject.custom.viewer.switcher',

		/**
		 * @event resizeButtons
		 * @event showEditor
		 */
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				customContainer = view.getCustomContainer(),
				subjectItem = view.getSubjectItem(),
				stateCmp;

			// переключаем состояние
			view.toggle();

			stateCmp = view.getStateCmp();

			// изменяем размеры кнопок
			subjectItem.fireEvent('resizeButtons', stateCmp);

			// показываем или скрываем редактируемые поля
			customContainer.fireEvent('showEditor', stateCmp);
		}
	}
);