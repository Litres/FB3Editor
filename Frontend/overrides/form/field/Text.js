/**
 * Корректировки для Ext.form.field.Text.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.override.form.field.Text',
	{
		override: 'Ext.form.field.Text',

		fieldSubTpl: [ // note: {id} here is really {inputId}, but {cmpId} is available
			'<tpl if="triggers.length"><span class="input-fade-triggers"></span>',
			'<tpl else><span class="input-fade"></span></tpl>',
			'<input id="{id}" data-ref="inputEl" type="{type}" role="{role}" {inputAttrTpl}',
			' size="1"', // allows inputs to fully respect CSS widths across all browsers
			'<tpl if="name"> name="{name}"</tpl>',
			'<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
			'<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
			'{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
			'<tpl if="readOnly"> readonly="readonly"</tpl>',
			'<tpl if="disabled"> disabled="disabled"</tpl>',
			'<tpl if="tabIdx != null"> tabindex="{tabIdx}"</tpl>',
			'<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
			' class="{fieldCls} {typeCls} {typeCls}-{ui} {editableCls} {inputCls}" autocomplete="off"/>',
			{
				disableFormats: true
			}
		],

		getValue: function ()
		{
			var me = this,
				val;

			val = me.callSuper(arguments);
			if (val && Ext.isString(val))
			{
				val = val.trim();
				val = val.replace(/\t/ig, ' ');
			}

			return val;
		}
	}
);