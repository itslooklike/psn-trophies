import { useState } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { Button, FormControl, FormLabel, FormHelperText, Input, Container, Box, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { Formik, Form, Field } from 'formik'

import { NAME_ACCOUNT_ID } from 'src/utils/constants'
import StoreSearch from 'src/store/StoreSearch'

const Login = observer(() => {
  const router = useRouter()

  const [data, dataSet] = useState<any>(null)

  const handleSearch = async (name: string) => {
    const response = await StoreSearch.fetch(name)
    dataSet(response)
  }

  const handleChoose = (id: string) => {
    Cookies.set(NAME_ACCOUNT_ID, id)
    router.push('/')
  }

  return (
    <Container maxW="container.md" mt="20">
      <Formik
        initialValues={{ name: '' }}
        onSubmit={async (values, actions) => {
          await handleSearch(values.name)
          actions.setSubmitting(false)
        }}
      >
        {(props) => (
          <Form>
            <Field name="name">
              {({ field, form }: { field: any; form: any }) => (
                <FormControl id="name" isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor="name">Enter PSN Name</FormLabel>
                  <Box d="flex" gridGap="2">
                    <Input {...field} id="name" placeholder="Name" disabled={props.isSubmitting} />
                    <Button isLoading={props.isSubmitting} type="submit">
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

      {data && (
        <Box mt="10" d="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gridGap="5" pb="10">
          {data.map((user: any) => (
            <Box
              cursor="pointer"
              p="2"
              key={user.accountId}
              onClick={() => handleChoose(user.accountId)}
              borderWidth="1px"
              borderRadius="lg"
              d="flex"
              gridGap="2"
              alignItems="center"
              transition="all 0.3s"
              _hover={{
                backgroundColor: 'gray.700',
                borderColor: 'transparent',
              }}
            >
              <img width="50" height="50" src={user.avatarUrl} alt={user.name} />
              <Box>
                <Text fontSize="xl">{user.name}</Text>
                <Text color="teal.600" fontSize="sm">
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