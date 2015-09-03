/**
 * Контроллер поля жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.subject',

		/**
		 * Заполняет текстовое поле выбранным жанром из списка.
		 * @param {Object} data Данные жанра.
		 */
		onSelectSubject: function (data)
		{
			var me = this,
				view = me.getView(),
				val,
				textfield;

			val = data[view.subjectTree.displayField];
			textfield = view.down('textfield');
			textfield.setValue(val);
			textfield.focusToEnd();
		},

		/**
		 * Показывает окно жанров.
		 */
		onShowSubjectTree: function ()
		{
			var me = this,
				view = me.getView(),
				subjectTree;

			subjectTree = view.subjectTree;
			subjectTree.subjectView = view;

			// показываем окно жанров
			subjectTree.initData();
		}
	}
);