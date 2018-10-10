/**
 * Список жанров/тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectController',
			'FBEditor.view.form.desc.subject.field.SubjectField'
		],

		xtype: 'form-desc-subject',
		controller: 'form.desc.subject',

		plugins: {
			ptype: 'fieldcontainerreplicator',
			groupName: 'classification-subject',
			btnStyle: {
				margin: '0 0 0 5px'
			}
		},

		layout: 'hbox',

		translateText: {
			undefined: 'Жанр/Тег',
			tip: 'Допустимо вводить несколько жанров/тегов через запятую'
		},

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.field.SubjectField} Текстовое поле жанра.
		 */
		subjectField: null,

		initComponent: function ()
		{
			var me = this,
				tt = me.translateText;

			me.items = [
				{
					xtype: 'form-desc-subject-field',
					flex: 1,
					fieldLabel: tt.undefined,
					labelAlign: 'right',
					labelWidth: 110,
					keyEnterAsTab: true
				}
			];

			me.callParent(arguments);
		},

		/**
		 * Возвращает текстовое поле жанра.
		 * @return {FBEditor.view.form.desc.subject.field.SubjectField}
		 */
		getSubjectField: function ()
		{
			var me = this,
				subjectField;

			subjectField  = me.subjectField || me.down('form-desc-subject-field');
			me.subjectField = subjectField;

			return subjectField;
		}
	}
);