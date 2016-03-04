/**
 * Функционал обязательного поля.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.Required',
	{
		/**
		 * Изменяет класс в зависимости от валидности.
		 */
		checkChangeCls: function ()
		{
			var me = this,
				cls = me._cls,
				isValid = me.isValid();

			me.removeCls(cls);

			if (!isValid)
			{
				me.addCls(cls);
			}
		}
	}
);