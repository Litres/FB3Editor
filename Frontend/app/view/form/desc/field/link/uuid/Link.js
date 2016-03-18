/**
 * Поле ссылки id.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.link.uuid.Link',
	{
		extend: 'FBEditor.view.form.desc.field.link.Link',
		xtype: 'form-desc-field-link-uuid',
		cls: 'form-desc-field-link-uuid',

		linkTpl: '<a href="https://hub.litres.ru/pages/any_uuid_redir/?uuid={href}" target="_blank"' +
		         ' title="{title}">{value}</a>',

		translateText: {
			pageEditor: 'Страница редактирования'
		},

		getDisplayValue: function()
		{
			var me = this,
				value = me.getRawValue(),
				display;

			if (me.renderer)
			{
				display = me.renderer.call(me.scope || me, value, me);
			}
			else
			{
				display = me._disableLink ? value :
				          new Ext.XTemplate(me.linkTpl).apply(
					          {
						          href: value,
						          value: value,
						          title: me.translateText.pageEditor
					          }
				          );
			}

			return display;
		}
	}
);