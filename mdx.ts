import unified from 'unified';
import remark from 'remark';
import mdxMetaData from 'remark-mdx-metadata';
import mdToMdast from 'remark-parse';
import mdToMdxast from 'remark-mdx';
import mdastToHast from 'remark-rehype';
// import doc from 'rehype-document';
// import format from 'rehype-format';
import hastToHtml from 'rehype-stringify';
import findFrontMatter from 'remark-frontmatter';
import visit from 'unist-util-visit';
import yamlToObject from 'remark-parse-yaml';

import mdx from '@mdx-js/mdx';

const copyFrontmatter = () => (ast, file) => {
  visit(ast, 'yaml', (item) => {
    file.data.frontmatter = item.data.parsedValue;
  });
};

const removeFrontmatter = () => (tree) => tree.filter((node) => node.type !== 'yaml');

export const parserMdx = (file) => {
  let res;

  return remark()
    .use(mdToMdxast)
    .use(mdxMetaData)
    .process(
      file,
      (err, vfile: {
        data: any;
        contents: any;
      }) => {
        if (err) throw err;

        res = {
          frontmatter: vfile.data.frontmatter,
          content: String(vfile.contents)
        };
      }
    );
};

export const parser = (file) => {

  let res;

  unified()
    // markdown processing
    .use(mdToMdast)
    .use(mdToMdxast)
    // .use(doc) // this is if you want <html>, <body>, and <head>
    // .use(format)

    // frontmatter processing
    .use(findFrontMatter, ['yaml'])
    .use(yamlToObject)
    .use(copyFrontmatter)

    // html processing
    .use(mdastToHast)
    .use(hastToHtml, { quoteSmart: true })

    // passing in file to processor
    .process(
      file,
      (err, vfile: {
        data: any;
        contents: any;
      }) => {
        if (err) throw err;

        res = {
          frontmatter: vfile.data.frontmatter,
          content: String(vfile.contents)
        };
      }
    );

    return res;
};

// export const parser = (md) => mdx(md);
