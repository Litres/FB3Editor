/**
 * Поле ID.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.editor.uuid.Uuid',
	{
		extend: 'FBEditor.view.form.desc.field.link.uuid.Link',
		
		xtype: 'form-desc-relations-subject-custom-editor-uuid',

		afterRender: function ()
		{
			var me = this,
				val = me.getValue(),
				manager = FBEditor.desc.Manager,
				id;

			me.callParent(arguments);

			if (!val)
			{
				// получаем новый id
				id = manager.getNewId();
				
				// обновляем поле ссылки id
				me.setValue(id);
				
				me.disableLink(true);
			}
		}
	}
);