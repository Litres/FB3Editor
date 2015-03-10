/**
 * Контроллер текстового поля жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectFieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subject.field',

		/**
		 * Вызывается при клике по полю.
		 */
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				val;

			// показываем дерево жанров
			view.ownerCt.fireEvent('showSubjectTree');
		}
	}
);