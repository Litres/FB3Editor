/**
 * Таблица преобразований XSLT для тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsl.Body',
	{
		singleton: true,

		/**
		 * Вовзращает xsl для преобразования xml в html.
		 * @return {String} Строка xsl
		 */
		getXmlToHtml: function ()
		{
			var xsl;
			
			/*xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="yes" method="html"/>\
	<xsl:template match="/">\
		<xsl:copy-of select="*"/>\
	</xsl:template>\
</xsl:stylesheet>\
			';*/

			xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="no" method="html"/>\
	<xsl:template match="*">ce(\'<xsl:value-of select="name()"/>\'<xsl:if test="* or .">, [<xsl:apply-templates/>]</xsl:if>)<xsl:if test="position()!=last()">, </xsl:if></xsl:template>\
	<xsl:template match="text()"><xsl:if test="normalize-space()">ct(\'<xsl:value-of select="."/>\')<xsl:if test="position()!=last()">, </xsl:if></xsl:if></xsl:template>\
</xsl:stylesheet>\
			';

			return xsl;
		},

		/**
		 * Вовзращает xsl для преобразования html в xml.
		 * @return {String} Строка xsl
		 */
		getHtmlToXml: function ()
		{
			var xsl;

			xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="yes" method="xml"/>\
	<xsl:template match="/">\
		<xsl:copy-of select="*"/>\
	</xsl:template>\
</xsl:stylesheet>\
			';

			return xsl;
		}
	}
);