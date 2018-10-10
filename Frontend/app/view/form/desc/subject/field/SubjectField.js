/**
 * Текстовое поле жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectField',
	{
		extend: 'FBEditor.view.form.desc.field.text.required.Required',
		requires: [
			'FBEditor.view.form.desc.subject.field.SubjectFieldController'
		],
		
		xtype: 'form-desc-subject-field',
		controller: 'form.desc.subject.field',
		name: 'classification-subject',

		listeners: {
			change: 'onChange',
			blur: 'onBlur'
		},

		checkChangeBuffer: 200,

		translateText: {
			tip: 'Допустимо вводить несколько жанров/тегов через'
		},

		/**
		 * @property {String} Сепаратор, который разделяет содержимое поля на несколько полей.
		 */
		separator: ';',

		/**
		 * @property {String} Заглушка для пустого поля.
		 */
		emptyValue: 'Не определён',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.Subject} Список жанров/тегов (родительский контейнер).
		 */
		subject: null,

		initComponent: function ()
		{
			var me = this,
				tt = me.translateText,
				tip;

			// подсказка под полем
			tip = '<span class="after-body">%t %s</span>'.replace('%t', tt.tip).replace('%s', me.separator);

			me.afterBodyEl = tip;

			me.callParent(arguments);
		},

		/**
		 * Возвращает родительский контейнер.
		 * @return {FBEditor.view.form.desc.subject.Subject}
		 */
		getSubject: function ()
		{
			var me = this,
				subject;

			subject  = me.subject || me.up('form-desc-subject');
			me.subject = subject;

			return subject;
		},

		/**
		 * Определяет пустое ли значение находится в поле.
		 * @return {Boolean}
		 */
		isEmptyValue: function ()
		{
			var me = this,
				val = me.getValue(),
				res;

			res = val === me.emptyValue;

			return res;
		}
	}
);