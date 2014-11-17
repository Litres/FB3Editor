/**
 * Контроллер поля жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subject',

		/**
		 * Заполняет текстовое поле выбранным жанром из списка.
		 * @param {Object} data Данные жанра.
		 * @param {String} data.name Название жанра.
		 * @param {String} data.value Значение жанра.
		 */
		onSelectSubject: function (data)
		{
			var me = this,
				view = me.getView(),
				textfield;

			textfield = view.query('textfield')[0];
			textfield.setValue(data.value);
		},

		onShowSubjectTree: function ()
		{
			var me = this,
				view = me.getView(),
				subjectTree;

			subjectTree = view.subjectTree;
			subjectTree.subjectView = view;
			subjectTree.show();
		}
	}
);