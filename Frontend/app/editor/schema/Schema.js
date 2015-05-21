/**
 * Правила проверки элементов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.schema.Schema',
	{
		requires: [
			'FBEditor.xsd.Body',
			'FBEditor.xsl.SchemaBody',
		    'FBEditor.editor.schema.Factory'
		],

		constructor: function ()
		{
			var me = this,
				xsl,
				xsd,
				xsdJson,
				cse,
				dse,
				elements;

			// сокращенная форма метода создания элемента схемы
			cse = function (name, options)
			{
				return FBEditor.editor.schema.Factory.createElement(name, options);
			};

			// сокращенная форма метода для определения типа схемы
			dse = function (name, options)
			{
				return FBEditor.editor.schema.Factory.defineType(name, options);
			};

			try
			{
				xsd = FBEditor.xsd.Body.getXsd();
				xsl = FBEditor.xsl.SchemaBody.getXsl();
				xsdJson = FBEditor.util.xml.Jsxml.trans(xsd, xsl);
				console.log(xsdJson);

				// преобразование строки в объект
				eval(xsdJson);
				console.log(elements);
			}
			catch (e)
			{
				Ext.log({level: 'error', msg: e, dump: e});
				Ext.Msg.show(
					{
						title: 'Ошибка',
						message: 'Невозможно инициализировать схему тела книги.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					}
				);
			}
		}
	}
);