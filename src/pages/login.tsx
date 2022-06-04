import JSCookies from 'js-cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { Button, FormControl, FormLabel, FormHelperText, Input, Container, Box, Text } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import { useMutation } from 'react-query'

import { NAME_ACCOUNT_ID } from 'src/utils/config'
import { clientFetch } from 'src/utils/clientFetch'

type TUser = {
  accountId: string
  name: string
  avatarUrl: string
}

const Login = observer(() => {
  const router = useRouter()

  const mutation = useMutation((name: string) => clientFetch.get<TUser[]>(`/psn/search?name=${name}`).then(({ data }) => data))

  const handleChoose = (id: string) => {
    JSCookies.set(NAME_ACCOUNT_ID, id, { expires: 365 })
    router.push(`/`)
  }

  return (
    <Container maxW={`container.md`} mt={`20`}>
      <Head>
        <title>Enter PSN Name</title>
      </Head>
      <Formik
        initialValues={{ name: (router.query.name as string) || `` }}
        onSubmit={(values, actions) => {
          mutation.mutate(values.name, {
            onSuccess: () => actions.setSubmitting(false),
          })
        }}
      >
        {(props) => (
          <Form>
            <Field name={`name`}>
              {({ field, form }: { field: any; form: any }) => (
                <FormControl id={`name`} isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor={`name`}>Enter PSN Name</FormLabel>
                  <Box display={`flex`} gridGap={`2`}>
                    <Input {...field} id={`name`} placeholder={`Name`} disabled={props.isSubmitting} />
                    <Button isLoading={props.isSubmitting} type={`submit`}>
                      Search
                    </Button>
                  </Box>
                  <FormHelperText>Make sure you profile is public</FormHelperText>
                </FormControl>
              )}
            </Field>
          </Form>
        )}
      </Formik>

      {mutation.data && (
        <Box mt={`10`} display={`grid`} gridTemplateColumns={`repeat(auto-fit, minmax(250px, 1fr))`} gridGap={`5`} pb={`10`}>
          {mutation.data.map((user) => (
            <Box
              cursor={`pointer`}
              p={`2`}
              key={user.accountId}
              onClick={() => handleChoose(user.accountId)}
              borderWidth={`1px`}
              borderRadius={`lg`}
              display={`flex`}
              gridGap={`2`}
              alignItems={`center`}
              transition={`all 0.3s`}
              _hover={{
                backgroundColor: `gray.700`,
                borderColor: `transparent`,
              }}
            >
              <img width={`50`} height={`50`} src={user.avatarUrl} alt={user.name} loading={`lazy`} />
              <Box>
                <Text fontSize={`xl`}>{user.name}</Text>
                <Text color={`teal.600`} fontSize={`sm`}>
                  {user.accountId}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  )
})

export default Login
