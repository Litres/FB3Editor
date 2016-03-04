/**
 * Поле фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.main.Main',
	{
		extend: 'FBEditor.view.form.desc.relations.subject.name.Name',
		mixins: {
			fieldRequired: 'FBEditor.view.form.desc.field.text.required.Required'
		},
		xtype: 'form-desc-relations-subject-name-main',
		allowBlank: false,

		_cls: 'field-required',

		listeners: {
			dirtychange: function ()
			{
				this.checkChangeCls();
			}
		},

		initComponent: function ()
		{
			var me = this;

			me.cls = me._cls;

			me.callParent(arguments);
		},

		/**
		 * Изменяет класс в зависимости от валидности.
		 */
		checkChangeCls: function ()
		{
			this.mixins.fieldRequired.checkChangeCls.call(this);
		}
	}
);